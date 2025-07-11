import { Stack } from "@openedx/paragon";

export const ComponentCard = ({ label, icon, navigate }) => (
  <div className="rounded-c-lg px-4 py-3 flex-grow-1 bg-white cursor-c-pointer">
    <Stack direction="horizontal" gap={3}>
      <span>{icon}</span>
      <span>{label}</span>
    </Stack>
  </div>
);