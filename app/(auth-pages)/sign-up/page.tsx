import { SignupFormDemo } from "@/components/Regitrarse";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default async function Signup() {
	return (
		<div className="w-screen h-screen ">
			<AuroraBackground>
				<div className="flex justify-center items-center h-screen z-10 ">
					<SignupFormDemo />
				</div>
			</AuroraBackground>
		</div>
	);
}
