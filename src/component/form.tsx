import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod schema: defines the shape of the form data + validation rules.
// react-hook-form will use this (via zodResolver) to produce `errors` and validate on submit.
const schema = z.object({
  // Required: at least 2 chars
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  // Required: at least 2 chars
  lastName: z.string().min(2, "Last name must be at least 2 characters."),

  // Optional: can be empty/undefined
  company: z.string().optional(),

  // Optional: if provided, must be a valid URL
  // Note: this uses the older chained style; Zod v4 may show a deprecation warning here.
  // Zod v4: prefer z.url() over z.string().url()
  website: z.url().optional(),

  // Required: must be a valid email
  email: z.email({ message: "Please enter a valid email address." }),

  // Required: at least 10 chars
  message: z.string().min(10, "Message must be at least 10 characters."),
});

// Typescript type inferred directly from the Zod schema.
// This keeps your form types and validation rules in sync.
// This keeps your form types and validation rules in sync.
type Inputs = z.infer<typeof schema>;

export function Form() {
  // useForm wires up:
  // - register(): connects inputs to react-hook-form
  // - handleSubmit(): runs validation + calls your onSubmit if valid
  // - watch(): lets you react to live field values (like conditionally showing fields)
  // - formState: contains validation errors and submission state
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    // Connect Zod validation to react-hook-form
    resolver: zodResolver(schema),
  });

  // Watch the company field in real-time.
  // We'll use this to conditionally render the Website field only when company has a value.
  const companyValue = watch("company");

  // Submit handler.
  // Returning a Promise allows react-hook-form to set `isSubmitting` while the promise is pending.
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    // Simulate an async request (e.g., sending data to an API)
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        alert(JSON.stringify(data, null, 2));
        resolve();
      }, 1500);
    });
  };

  return (
    // Outer wrapper: centers the form on the screen
    <div className="flex justify-center align-middle  m-5">
      <form
        className="flex flex-col gap-4 m-2 xs:w-375 md:w-xl min-w-xs h-fit  p-5 border border-gray-300 rounded-lg bg-gray-800 shadow-2xl"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-busy={isSubmitting}
      >
        <label htmlFor="firstName">First Name *</label>
        <input
          id="firstName"
          // Conditional Tailwind class:
          // - if there's an error, show a red border
          // - otherwise, show a neutral gray border
          className={`rounded-lg border p-2 w-full focus:bg-gray-700 ${
            errors.firstName ? "border-red-500" : "border-gray-100"
          }`}
          type="text"
          aria-required="true"
          aria-invalid={Boolean(errors.firstName)}
          aria-describedby={errors.firstName ? "firstName-error" : undefined}
          // register() connects this input to RHF and associates it with the "firstName" key
          {...register("firstName", { required: true })}
        />
        {/* role="alert" announces the error message when it appears */}
        {errors.firstName && (
          <p id="firstName-error" className="text-red-500" role="alert">
            {errors.firstName.message}
          </p>
        )}

        <label htmlFor="lastName">Last Name *</label>
        <input
          id="lastName"
          className={`rounded-lg border p-2 w-full focus:bg-gray-700 ${
            errors.lastName ? "border-red-500" : "border-gray-100"
          }`}
          type="text"
          aria-required="true"
          aria-invalid={Boolean(errors.lastName)}
          aria-describedby={errors.lastName ? "lastName-error" : undefined}
          {...register("lastName", { required: true })}
        />
        {errors.lastName && (
          <p id="lastName-error" className="text-red-500" role="alert">
            {errors.lastName.message}
          </p>
        )}

        <label htmlFor="company">Company</label>
        <input
          id="company"
          className={`rounded-lg border p-2 w-full focus:bg-gray-700 ${
            errors.company ? "border-red-500" : "border-gray-100"
          }`}
          type="text"
          aria-invalid={Boolean(errors.company)}
          aria-describedby={errors.company ? "company-error" : undefined}
          {...register("company", {
    setValueAs: (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  })}
        />
        {errors.company && (
          <p id="company-error" className="text-red-500" role="alert">
            {errors.company.message}
          </p>
        )}

        {/* Conditional field:
            If company has any value, we show "Website". */}
        {companyValue && (
          <>
            <label htmlFor="website">Website</label>
            <input
              id="website"
              // Use type="url" for nicer mobile keyboards + built-in browser hints
              type="url"
              {...register("website", {
    setValueAs: (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  })}
              aria-invalid={Boolean(errors.website)}
              aria-describedby={errors.website ? "website-error" : undefined}
              className={`rounded-lg border p-2 w-full focus:bg-gray-700 ${
                errors.website ? "border-red-500" : "border-gray-100"
              }`}
            />
            {errors.website && (
              <p id="website-error" className="text-red-500" role="alert">
                {errors.website.message}
              </p>
            )}
          </>
        )}

        <label htmlFor="email">Email *</label>
        <input
          id="email"
          className={`rounded-lg border p-2 w-full focus:bg-gray-700 ${
            errors.email ? "border-red-500" : "border-gray-100"
          }`}
          type="email"
          inputMode="email"
          autoComplete="email"
          aria-required="true"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email", { required: false })}
        />
        {errors.email && (
          <p id="email-error" className="text-red-500" role="alert">
            {errors.email.message}
          </p>
        )}

        <label htmlFor="message">Message *</label>
        <textarea
          id="message"
          className={`rounded-lg border p-2 w-full h-60 focus:bg-gray-700 ${
            errors.message ? "border-red-500" : "border-gray-100"
          }`}
          aria-required="true"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          {...register("message", { required: true })}
        />
        {errors.message && (
          <p id="message-error" className="text-red-500" role="alert">
            {errors.message.message}
          </p>
        )}

        <button
          // While submitting, disable the button to prevent double-submits
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
          className="disabled:bg-gray-500 disabled:text-gray-300 w-full bg-blue-800 hover:bg-blue-700 text-white rounded px-3 py-2"
          type="submit"
        >
          {/* Friendly UX: change label while waiting */}
          {isSubmitting ? "Sending..." : "Submit"}
        </button>
      </form>
    </div>
  );
}