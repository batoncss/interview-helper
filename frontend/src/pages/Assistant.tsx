import { AssistantProvider } from "../context/AssistantProvider";
import { AssistantUI } from "../components/AssistantUI";

export default function Page() {
  return (
    <AssistantProvider>
      <AssistantUI />
    </AssistantProvider>
  );
}
