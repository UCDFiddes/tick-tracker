"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

type ComponentProps = {
	children: React.ReactNode;
};
export default function QueryWrapper({ children }: ComponentProps) {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
