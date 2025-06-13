import PageMeta from "../../../components/common/PageMeta";
import SignInForm from "../components/SignInForm";
import AuthLayout from "../layout/AuthLayout";

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
