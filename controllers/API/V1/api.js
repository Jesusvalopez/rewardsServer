import User from "../../../models/user.js";
import Coupon from "../../../models/coupon.js";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

export const getUsersCoupons = async (req, res) => {
  try {
    console.log(req.params.id);
    const user = await User.findOne({
      _id: req.params.id,
    });

    const coupons = await Coupon.find({
      user: user.email,
      deletedAt: { $eq: null },
      isExpired: { $eq: false },
      isUsed: { $eq: false },
    });

    return res.status(200).json({ coupons });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
export const getUsersByEmail = async (req, res) => {
  try {
    const users = await User.find({
      email: { $regex: req.params.email, $options: "i" },
    }).select("email");

    return res.status(200).json({ users });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

export const createWoocommerceCoupon = (coupon) => {
  const api = new WooCommerceRestApi.default({
    url: process.env.WOOCOMMERCE_STORE_URL,
    consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY,
    consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET,
    version: "wc/v3",
  });

  const couponData = {
    code: coupon.code,
    discount_type: "fixed_cart",
    amount: coupon.value.toString(),
    individual_use: true,
    exclude_sale_items: true,
    minimum_amount: coupon.minAmount.toString(),
    individual_use: true,
    usage_limit: 1,
    usage_limit_per_user: 1,
    date_expires: coupon.expireDate,
    free_shipping: false,
    email_restrictions: [coupon.user],
  };

  const newCouponData =
    coupon.type === "Product"
      ? {
          ...couponData,
          discount_type: "fixed_product",
          product_ids: coupon.woocommerceIds,
          limit_usage_to_x_items: 1,
        }
      : couponData;

  api
    .post("coupons", newCouponData)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error.response.data);
    });
};
