import { configureStore } from "@reduxjs/toolkit";
import Account from "./Features/Account";
import Product from "./Features/Product";
import WalletSlice from "./Features/WalletSlice";
import Shop from "./Features/Shop";
import Jobs from "./Features/Jobs";

export const store = configureStore({
  reducer: {
    Account: Account,
    Products: Product,
    Wallet: WalletSlice,
    Shops: Shop,
    Jobs: Jobs,
  },
});
