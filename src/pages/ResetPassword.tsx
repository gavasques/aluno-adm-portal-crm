
import { useTokenValidation } from "@/hooks/auth/useTokenValidation";
import { LoadingToken } from "@/components/auth/LoadingToken";
import { InvalidToken } from "@/components/auth/InvalidToken";
import { PasswordResetForm } from "@/components/auth/PasswordResetForm";

const ResetPassword = () => {
  const { validatingToken, tokenValid, error } = useTokenValidation();

  // If validating the token, show loading
  if (validatingToken) {
    return <LoadingToken />;
  }
  
  // If the token is not valid, show error message
  if (!tokenValid) {
    return <InvalidToken error={error} />;
  }

  // If token is valid, show password reset form
  return <PasswordResetForm />;
};

export default ResetPassword;
