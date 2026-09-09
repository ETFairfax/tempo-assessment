import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert"
import { Button } from "@workspace/ui/components/button"
import { InfoIcon } from "lucide-react"

export default function Home() {
  return (
    <div className="p-4">
      <Alert variant="destructive" className="lg:hidden ">
        <InfoIcon />
        <AlertTitle>Screen size not supported</AlertTitle>
        <AlertDescription>
          This application is intended to be used on desktop. Minimum screen resolution: 1024x768.
        </AlertDescription>          
      </Alert>
    
      <div className="flex min-h-svh p-6">
        <div className="hidden lg:flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
          <div>
            <h1 className="font-medium">Project ready!</h1>
            <p>You may now add components and start building.</p>
            <p>We&apos;ve already added the button component for you.</p>
            <Button className="mt-2">Button</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
