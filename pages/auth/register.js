import { BaseAuthLayout } from "../../components/Auth/Base";
import { RegisterForm } from "../../components/Auth/Register";
import Link from "next/link";

const styles = {
  marginTop: 30,
  textAlign: "center",
};
export default function Register() {
  return (
    <BaseAuthLayout>
      <RegisterForm />

      <div style={styles}>
        <Link href="/auth/login">Already have an account? Login</Link>
      </div>
    </BaseAuthLayout>
  );
}
