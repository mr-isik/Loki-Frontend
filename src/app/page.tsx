import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const page = () => {
  return (
    <div className="flex gap-4">
      <Button>Primary Button</Button>
      <Button variant="secondary">Secondary Button</Button>
      <Button variant="destructive">Destructive Button</Button>
      <Button variant="ghost">Ghost Button</Button>
      <Button variant="outline">Outline Button</Button>
      <Input placeholder="Type here..." />
      <Textarea placeholder="Type your message..." />
    </div>
  );
};

export default page;
