import { AssistantProvider } from "../context/AssistantProvider";
import { AssistantUI } from "../components/assistant/AssistantUI.tsx";

export default function Page() {
  return (
    <AssistantProvider>
      <AssistantUI />
    </AssistantProvider>
  );
}
