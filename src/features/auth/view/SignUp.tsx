//import PageMeta from "../../../components/common/PageMeta";
import SignUpForm from "../components/SignUpForm";
import AuthLayout from "../layout/AuthLayout";

export default function SignUp() {
  return (
    <>
      {/* <PageMeta
        title="Sign Up | AutoSystem"
        description="Create an AutoSystem account to register and manage your vehicles, view fines, and book inspections."
      /> */}
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
