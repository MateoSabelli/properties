import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RecentSales({ clients }: { clients: any[] }) {
  return (
    <div className="space-y-8">
      {clients.map((client) => (
        <div key={client.name} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>{client.name?.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{client.name}</p>
            <p className="text-sm text-muted-foreground">{client.email}</p>
          </div>
          <div className="ml-auto font-medium">$</div>
        </div>
      ))}
    </div>
  );
}
