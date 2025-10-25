export default function generatingListRecognizedSpeech(
  oldList: string[],
  event_type: string,
  text: string,
) {
  const newList = [...(oldList || [])];
  if (newList.length === 0) newList.push("");
  newList[newList.length - 1] = text;
  if (event_type === "final_refinement") {
    newList.push("");
  }
  return newList;
}
