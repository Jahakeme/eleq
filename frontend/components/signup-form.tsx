import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Fill in the form below to create your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input id="name" type="text" placeholder="John Doe" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input id="password" type="password" required />
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input id="confirm-password" type="password" required />
          <FieldDescription>Please confirm your password.</FieldDescription>
        </Field>
        <Field>
          <Button type="submit">Create Account</Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button variant="outline" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 0 48 48">
              <path
                d="M9.82727273 24c0-1.5242667.25315907-2.9856.705-4.3562667L2.62345455 13.6042667C1.08206818 16.7338667.21363636 20.2602667.21363636 24c0 3.7365333.86736364 7.2608 2.40661364 10.3882667l7.90454545-6.0512C10.0772273 26.9728 9.82727273 25.5168 9.82727273 24"
                fill="#FBBC05"
              />
              <path
                d="M23.7136364 10.1333333c3.3113636 0 6.3022727 1.1733334 8.6522727 3.0933334l6.8363636-6.8266667C35.0363636 2.7733333 29.6954545.5333333 23.7136364.5333333 14.4268636.5333333 6.4454091 5.8442667 2.62345455 13.6042667l7.90881815 6.0394666C12.3545909 14.112 17.5491591 10.1333333 23.7136364 10.1333333"
                fill="#EB4335"
              />
              <path
                d="M23.7136364 37.8666667c-6.1644773 0-11.3589545-3.9786667-13.1813637-9.5104l-7.90881815 6.0384C6.4454091 42.1557333 14.4268636 47.4666667 23.7136364 47.4666667c5.7318636 0 11.2041591-2.0352 15.3113181-5.8485334l-7.5071818-5.8037333c-2.1182045 1.3344-4.7854545 2.0522667-7.8031363 2.0522667"
                fill="#34A853"
              />
              <path
                d="M46.1454545 24c0-1.3866667-.2136363-2.88-.5340909-4.2666667H23.7136364V28.8h12.6045454c-.6302272 3.0912-2.3457272 5.4677333-4.8004091 7.0144l7.5071818 5.8037333C43.3393409 37.6138667 46.1454545 31.6490667 46.1454545 24"
                fill="#4285F4"
              />
            </svg>
            Sign up with Google
          </Button>
          <FieldDescription className="px-6 text-center">
            Already have an account? <a href="#">Sign in</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
