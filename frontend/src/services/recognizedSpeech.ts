export default function generatingListRecognizedSpeech(
  oldList: string[],
  message: string,
) {
  const data = JSON.parse(message);
  const newList = [...(oldList || [])];
  if (newList.length === 0) newList.push("");
  newList[newList.length - 1] = data.text;
  if (data.event_type === "final_refinement") {
    newList.push("");
  }
  return newList;
}
