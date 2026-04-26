import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { registerPasskey } from "../../lib/webauthn";
import { useTransition, useReducer } from "react";
import { Button } from "../../components/ui/button";
import { trpcClient } from "../../lib/trpc/client";

export const Route = createFileRoute("/auth/sign-up")({
  component: SignUpComponent,
});

// --- Registration State Machine ---

type RegistrationState =
  | { status: "idle" }
  | { status: "registering" }
  | { status: "error"; message: string }
  | { status: "success" };

type RegistrationAction =
  | { type: "START" }
  | { type: "FAIL"; message: string }
  | { type: "SUCCESS" }
  | { type: "RETRY" };

function registrationReducer(
  state: RegistrationState,
  action: RegistrationAction,
): RegistrationState {
  switch (action.type) {
    case "START":
      return { status: "registering" };
    case "FAIL":
      return { status: "error", message: action.message };
    case "SUCCESS":
      return { status: "success" };
    case "RETRY":
      return { status: "idle" };
    default:
      return state;
  }
}

function useRegistrationFlow() {
  const [state, dispatch] = useReducer(registrationReducer, { status: "idle" });

  const startRegistration = () => dispatch({ type: "START" });
  const failRegistration = (message: string) =>
    dispatch({ type: "FAIL", message });
  const succeedRegistration = () => dispatch({ type: "SUCCESS" });
  const retryRegistration = () => dispatch({ type: "RETRY" });

  return {
    state,
    startRegistration,
    failRegistration,
    succeedRegistration,
    retryRegistration,
  };
}

// --- Component ---

function SignUpComponent() {
  const [isPending, startTransition] = useTransition();
  const flow = useRegistrationFlow();

  const form = useForm({
    defaultValues: {
      handle: "",
    },
    onSubmit: async ({ value }) => {
      if (flow.state.status === "error") {
        flow.retryRegistration();
      }

      flow.startRegistration();

      try {
        const handle = value.handle;
        const regResponse = await registerPasskey(handle);
        console.log("Registration successful, verifying with server...");

        const verification = await trpcClient.webauthn.verifyRegistration.mutate({
          handle,
          response: regResponse,
        });

        if (verification.verified) {
          flow.succeedRegistration();
        } else {
          flow.failRegistration("Server verification failed.");
        }
      } catch (err: any) {
        if (err.name === "InvalidStateError") {
          flow.failRegistration("This device is already registered.");
        } else {
          flow.failRegistration(err.message || "Registration failed");
        }
      }
    },
  });

  const isFormDisabled = isPending || flow.state.status === "registering";

  return (
    <div className="max-w-[420px] mx-auto space-y-8 py-12">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-serif italic tracking-tight">Sign Up</h1>
        <p className="text-muted-foreground font-typewriter">
          Join the LEDGER.
        </p>
      </div>

      <div className="relative">
        {/* Success Message overlay/banner */}
        {flow.state.status === "success" && (
          <div className="mb-8 p-4 sketchy-border hatch-shadow bg-card text-center">
            <h3 className="text-primary font-serif italic text-lg mb-1">
              Welcome to Veracity
            </h3>
            <p className="text-muted-foreground font-mono text-sm">
              Your passkey is registered. You can now sign in.
            </p>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            startTransition(async () => {
              await form.handleSubmit();
            });
          }}
          className="space-y-6"
          noValidate
        >
          <form.Field
            name="handle"
            validators={{
              onChange: ({ value }) =>
                !value ? "Author handle is required" : undefined,
              onBlur: ({ value }) =>
                !value ? "Author handle is required" : undefined,
            }}
            children={(field) => {
              const hasError =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;

              return (
                <div className="space-y-2">
                  <label
                    htmlFor={field.name}
                    className="text-sm font-medium font-mono"
                  >
                    Author Handle
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      if (flow.state.status === "error")
                        flow.retryRegistration();
                    }}
                    disabled={isFormDisabled}
                    autoFocus
                    autoComplete="username webauthn"
                    aria-invalid={hasError}
                    aria-describedby={
                      hasError ? `${field.name}-error` : undefined
                    }
                    placeholder="e.g. johndoe"
                    className={`w-full p-2 bg-transparent focus:outline-none font-mono transition-all ${
                      hasError
                        ? "border-b-2 border-destructive text-destructive placeholder:text-destructive/50"
                        : "sketchy-border"
                    } disabled:opacity-50`}
                  />
                  {hasError && (
                    <div
                      id={`${field.name}-error`}
                      role="alert"
                      className="text-xs font-mono text-destructive mt-1"
                    >
                      {field.state.meta.errors.join(", ")}
                    </div>
                  )}
                </div>
              );
            }}
          />

          {/* Reducer Error State */}
          {flow.state.status === "error" && (
            <div
              role="alert"
              className="p-3 sketchy-border bg-destructive/10 text-destructive text-sm font-mono text-center"
            >
              {flow.state.message}
            </div>
          )}

          <form.Subscribe
            selector={(state) => [state.canSubmit]}
            children={([canSubmit]) => {
              let buttonText = "Create Passkey";
              if (isFormDisabled) buttonText = "Inking...";
              if (flow.state.status === "error") buttonText = "Try Again";

              return (
                <Button
                  type="submit"
                  disabled={!canSubmit || isFormDisabled}
                  className="w-full"
                >
                  {buttonText}
                </Button>
              );
            }}
          />
        </form>
      </div>

      <div className="text-center text-sm font-mono pt-4">
        Returning author?{" "}
        <Link
          to="/auth/sign-in"
          className="text-primary underline underline-offset-4 hover:opacity-80"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
