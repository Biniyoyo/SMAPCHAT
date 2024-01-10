import { useReducer, useState } from "react";

import MapCard from "../reuseable/MapCard";
import CommentComponent from "../reuseable/CommentComponent";
import ScrollableGallery from "../reuseable/ScrollableGallery";
import ScrollableComments from "../reuseable/ScrollableComments";
import SearchWidget from "../reuseable/SearchWidget";

import arrowData from "../editor/SampleArrowMap.json";
import ArrowMapToolbox from "../editor/ArrowMapToolbox";
import TransactionHandler from "../editor/TransactionHandler";

import bubbleData from "../editor/SampleBubbleMap.json";
import BubbleMapToolbox from "../editor/BubbleMapToolbox";

import scaleData from "../editor/SampleScaleMap.json";
import ScaleMapToolbox from "../editor/ScaleMapToolbox";

import categoryData from "../editor/SampleCategoryMap.json";
import CategoryMapToolbox from "../editor/CategoryMapToolbox";

import pictureData from "../editor/SamplePictureMap.json";
import PictureMapToolbox from "../editor/PictureMapToolbox";
import Customer from "../reuseable/Customer";

export default function ElementDemo() {
  /// This is for testing, but serves as an example of how to use the TransactionHandler
  /// we should set up a state variable for the JSON data we are mutating, a reducer
  /// so our transaction handler can force re-renders on un/redo, and then pass those
  /// to a new TransactionHandler. We can then pass this handler as props to the various
  /// components on an editing page.
  const [data] = useState(arrowData);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const handler = useState(new TransactionHandler(data, forceUpdate))[0];

  const [bData] = useState(bubbleData);
  const bHandler = useState(new TransactionHandler(bData, forceUpdate))[0];

  const [sData] = useState(scaleData);
  const sHandler = useState(new TransactionHandler(sData, forceUpdate))[0];

  const [cData] = useState(categoryData);
  const cHandler = useState(new TransactionHandler(cData, forceUpdate))[0];

  const [pData] = useState(pictureData);
  const pHandler = useState(new TransactionHandler(pData, forceUpdate))[0];

  return (
    <>
      Hello, I am the map page!
      <CommentComponent />
      <MapCard />
      <SearchWidget />
      <ScrollableGallery />
      <ScrollableComments />
      <Customer />
      <ArrowMapToolbox handler={handler} arrowMap={data} />
      <BubbleMapToolbox handler={bHandler} bubbleMap={bData} />
      <ScaleMapToolbox handler={sHandler} scaleMap={sData} />
      <CategoryMapToolbox handler={cHandler} categoryMap={cData} />
      <PictureMapToolbox handler={pHandler} pictureMap={pData} />
    </>
  );
}
