import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";

export default async function verify(req, res) {
  // check if the request method is POST
  if (req.method === "POST") {
    try {
      const { message, signature, publicKey } = req.body;

      // convert the received message, signature, and public key to byte arrays
      const messageBytes = naclUtil.decodeUTF8(message);
      const signatureBytes = naclUtil.decodeBase64(signature);
      const publicKeyBytes = naclUtil.decodeBase64(publicKey);

      // verify the signature using the sender's public key and the original message
      const isSignatureValid = nacl.sign.detached.verify(
        messageBytes,
        signatureBytes,
        publicKeyBytes
      );

      // return a response based on whether the signature is valid
      if (isSignatureValid) {
        return res
          .status(200)
          .json({ verified: true, message: "Identity verified successfully!" });
      } else {
        return res
          .status(200)
          .json({ verified: false, message: "Identity verification failed." });
      }
    } catch (error) {
      // catch and handle any unexpected errors
      console.error("Verification error: ", error);

      return res
        .status(500)
        .json({ verified: false, message: "Internal server error" });
    }
  } else {
    // return a helpful message if the method is not POST
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
