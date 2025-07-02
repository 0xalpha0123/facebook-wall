import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface SidebarData {
  name: string;
  subtitle: string;
  photo: string;
  networks: string[];
  city: string;
}

export default function RightSidebar({ sidebar }: { sidebar: SidebarData }) {
  return (
    <Card className="rounded-xl shadow p-6 flex flex-col items-center">
      <Avatar className="w-full max-w-[160px] h-auto mb-4">
        <AvatarImage src={sidebar.photo} alt="Profile photo" />
        <AvatarFallback>{sidebar.name[0]}</AvatarFallback>
      </Avatar>
      <div className="text-2xl font-bold mb-1 text-center">{sidebar.name}</div>
      <div className="text-blue-600 mb-4 text-center">{sidebar.subtitle}</div>
      <Button variant="outline" className="w-full mb-4 font-medium text-gray-700">Information</Button>
      <div className="w-full text-left mb-2">
        <div className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide mb-1">Networks</div>
        <div className="text-gray-800 dark:text-gray-200 text-sm font-medium mb-1">{sidebar.networks.join(", ")}</div>
        <div className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide mb-1 mt-4">Current City</div>
        <div className="text-gray-800 dark:text-gray-200 text-sm font-medium">{sidebar.city}</div>
      </div>
    </Card>
  );
} 