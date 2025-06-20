import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Sign In | AutoSystem"
        description="Access your AutoSystem dashboard to manage vehicles, fines, and inspections."
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
