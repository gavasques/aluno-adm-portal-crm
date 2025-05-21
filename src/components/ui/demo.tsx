
import { GridBackground } from "@/components/ui/grid-background";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Icons } from "@/components/ui/icons";

export function Demo() {
  return (
    <div className="relative min-h-screen">
      <GridBackground />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-xl mx-auto p-8 space-y-12">
          <div className="space-y-6 text-center">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-br from-gray-200 to-gray-600">
              Join Our Product Launch Waitlist
            </h2>
            <p className="text-xl text-gray-400 max-w-lg mx-auto">
              Be part of something truly extraordinary. Join thousands of others
              already gaining early access to our revolutionary new product.
            </p>
          </div>

          <div className="flex gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="h-12 bg-gray-950/50 border-gray-800"
            />
            <Button
              className="h-12 px-6 bg-black hover:bg-black/90 text-white"
              variant="ghost"
            >
              Get Notified
            </Button>
          </div>

          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <Avatar className="border-2 w-12 h-12">
                  <AvatarFallback className="text-sm font-semibold border-white/20 bg-purple-600">JD</AvatarFallback>
                </Avatar>
                <Avatar className="border-2 w-12 h-12">
                  <AvatarFallback className="text-sm font-semibold border-white/20 bg-blue-600">AS</AvatarFallback>
                </Avatar>
                <Avatar className="border-2 w-12 h-12">
                  <AvatarFallback className="text-sm font-semibold border-white/20 bg-blue-700">MK</AvatarFallback>
                </Avatar>
              </div>
              <span className="font-bold">100+ people on the waitlist</span>
            </div>

            <div className="flex gap-6 justify-center">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-gray-300"
              >
                <Icons.twitter className="w-5 h-5 fill-current" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-gray-300"
              >
                <Icons.gitHub className="w-5 h-5 fill-current" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Demo;
