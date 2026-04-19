import React from "react";
import SwapClient from "./SwapClient";

export function generateStaticParams() {
  return [{ id: "mock-swap-id" }, { id: "test-swap-1" }];
}

export default async function NegotiationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <SwapClient swapId={id} />;
}
