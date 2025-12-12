import type { Route } from "./+types/home";
import { CindyTest } from "../components/CindyTest";
import IGCUploader from "~/components/IGCUploader";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "testingshit" },
		{ name: "testingshit", content: "getfisted" },
	];
}

export default function Home() {
	return (
		<div>
			<IGCUploader />
			<CindyTest />
		</div>
	);
}
