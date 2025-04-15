import { useState } from "react";
import verifySignature from "@/utils/verifySignature";
import styles from "../styles/index.module.css";

export default function LoginPage() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    const verificationResult = await verifySignature();

    setTimeout(() => {
      setIsLoading(false);
      setResult(verificationResult);
    }, 2000);
  };

  return (
    <div className={styles.page}>
      {!result ? (
        <div className={styles.login}>
          <h1>Sign & Verify</h1>
          <p>
            A simple web application that illustrates digital signature-based
            login, using cryptographic key pairs.
          </p>
          <img src="../document.svg" alt="signingImg" />
          <div className={styles.btnWrapper}>
            <button
              className={isLoading ? styles.inactive : ""}
              onClick={handleLogin}
            >
              {isLoading ? "Verifying..." : "Login with your ID"}
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.result}>
          <p>{result.message}</p>
          <div>
            {result.verified ? (
              <img src="../success.png" />
            ) : (
              <img src="../fail.png" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
