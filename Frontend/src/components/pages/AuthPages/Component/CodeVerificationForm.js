import React, { useState } from "react";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  updatePasswordWithCode,
  verifyResetCode,
} from "../../../../util/userUtil";

const CodeVerificationForm = ({ email }) => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isFeedbackError, setIsFeedbackError] = useState(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);

  const handleRouteToLogin = () => navigate("/login-page");

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await verifyResetCode(email, code);
    console.log(result);
    if (result.success && result.data) {
      console.log("Code verified successfully.");
      setIsCodeVerified(true);
    } else {
      console.error(result.error);
      setFeedback(result.error);
      setIsCodeVerified(false);
    }
    setIsLoading(false);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setFeedback("Passwords do not match. Please try again.");
      setIsFeedbackError(true);
      return;
    }
    if (newPassword.length < 6) {
      setFeedback("Password should be at least 6 characters.");
      setIsFeedbackError(true);
      return;
    }

    const result = await updatePasswordWithCode(email, code, newPassword);

    if (result.success && result.data) {
      setFeedback("Password updated successfully.");
      setIsFeedbackError(false);
      setIsPasswordUpdated(true);
    } else {
      setFeedback(result.error || "An error occurred during password update.");
      setIsFeedbackError(true);
    }
    setIsLoading(false);
  };

  return (
    <>
      {!isCodeVerified ? (
        <>
          <div className="mb-4">
            Enter the code that we sent to your email. If you don't see the
            email in your inbox, please check your spam folder or wait a few
            more minutes, as it might take some time to arrive.
          </div>
          <Form
            className="login-form"
            onSubmit={handleVerifyCode}
            style={{ maxWidth: "40%" }}
          >
            <Form.Group className="mb-3" controlId="formBasicVerificationCode">
              <Form.Control
                type="text"
                placeholder="Enter Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </Form.Group>
            <Button className="btn btn-2 mx-auto mb-5" size="lg" type="submit">
              {isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span className="ms-2">Loading...</span>
                </>
              ) : (
                "Verify Code"
              )}
            </Button>
          </Form>
        </>
      ) : (
        <>
          <div className="mb-4">Set your new password.</div>
          <Form
            className="login-form"
            onSubmit={handlePasswordReset}
            style={{ maxWidth: "40%" }}
          >
            <Form.Group className="mb-3" controlId="formBasicNewPassword">
              <Form.Control
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
            {feedback && (
              <Alert variant={isFeedbackError ? "danger" : "success"}>
                {feedback}
              </Alert>
            )}

            {!isPasswordUpdated && (
              <Button
                className="btn btn-2 mx-auto mb-5"
                size="lg"
                type="submit"
              >
                {isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    <span className="ms-2">Loading...</span>
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            )}
            {isPasswordUpdated && (
              <Button
                onClick={handleRouteToLogin}
                className="btn btn-2 mx-auto mb-5"
              >
                Go to Login
              </Button>
            )}
          </Form>
        </>
      )}
    </>
  );
};

export default CodeVerificationForm;
