import { SignInForm } from "@/components/Login";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default async function Login() {
	return (
		<div className="w-screen h-screen">
			<AuroraBackground>
				<div className="flex justify-center items-center h-screen z-10 ">
					<div>
						<SignInForm />
					</div>
				</div>
			</AuroraBackground>
		</div>
	);
}
