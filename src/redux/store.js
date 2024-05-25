import { configureStore } from "@reduxjs/toolkit";
import Account from "./Features/Account";
import Product from "./Features/Product";
import WalletSlice from "./Features/WalletSlice";

export const store = configureStore({
  reducer: {
    Account: Account,
    Products: Product,
    Wallet: WalletSlice,
  },
});
