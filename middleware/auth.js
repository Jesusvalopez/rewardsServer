import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.json({ message: "No autorizado" });

    // const isCustomAuth = token.length < 500;

    let decodedData;

    decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decodedData?.id;
    req.userEmail = decodedData?.email;

    if (!req.userId) return res.json({ message: "No autorizado" });

    /*
    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, process.env.JWT_SECRET);

      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);

      req.userId = decodedData?.sub;
    }
*/
    next();
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export default auth;
