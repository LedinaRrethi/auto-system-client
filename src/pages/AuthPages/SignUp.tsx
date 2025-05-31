import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="Sign Up | AutoSystem"
        description="Create an AutoSystem account to register and manage your vehicles, view fines, and book inspections."
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
