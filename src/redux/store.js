import { configureStore } from "@reduxjs/toolkit";
import Account from "./Features/Account";
import Product from "./Features/Product";
import WalletSlice from "./Features/WalletSlice";
import Shop from "./Features/Shop";
import Jobs from "./Features/Jobs";
import NewsSlice from "./Features/NewsSlice";
import Chat from "./Features/Chat";
import Notifications from "./Features/Notifications";
import OurAds from "./Features/OurAds";
export const store = configureStore({
  reducer: {
    Account: Account,
    Products: Product,
    Wallet: WalletSlice,
    Shops: Shop,
    Jobs: Jobs,
    News: NewsSlice,
    Chat: Chat,
    Notifications: Notifications,
    OurAds: OurAds,
  },
});
