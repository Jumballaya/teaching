import { bongodb } from "../core";

const bongo = new bongodb.BongoDBServer(27127);

bongo.start();