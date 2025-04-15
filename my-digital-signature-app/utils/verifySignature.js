import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";

const name = "SashkaJanevska";
const githubID = "sashka";
const date = "20250413";
const errorData = {
  verified: false,
  message: "Oops! Something went wrong. Please try again later.",
};

const verifySignature = async () => {
  try {
    const message = `BLOCKIA-${name}-${githubID}-${date}`;

    // generate a new cryptographic key pair
    const keyPair = nacl.sign.keyPair();

    // convert the message to a byte array
    const messageBytes = naclUtil.decodeUTF8(message);

    // create a digital signature using the message and the private key
    const signature = nacl.sign.detached(messageBytes, keyPair.secretKey);

    // encode the signature and public key as base64 strings for sending to backend
    const signatureString = naclUtil.encodeBase64(signature);
    const publicKeyString = naclUtil.encodeBase64(keyPair.publicKey);

    const response = await fetch("/api/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        signature: signatureString,
        publicKey: publicKeyString,
      }),
    });

    // handle server-side errors
    if (!response.ok) {
      const error = await response.json();

      console.error("Server error: ", error.message);
      return errorData;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // catch and handle any unexpected errors
    console.error("Verification error: ", error);

    return errorData;
  }
};

export default verifySignature;
