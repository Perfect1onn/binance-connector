import mongoose, { Schema } from "mongoose";

const BTCMarkPrice = new mongoose.Schema({
	markPrice: { type: Number },
	timeStamp: { types: Number },
});

export default mongoose.model("BTCMarkPrice", BTCMarkPrice);
