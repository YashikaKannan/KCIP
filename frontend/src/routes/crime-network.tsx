import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";
import { useGraph } from "@/hooks/api/useKcipQueries";

export const Route = createFileRoute("/crime-network")({
  head: () => ({ meta: [
    { title: "Crime Network — KCIP" },
    { name: "description", content: "Graph visualization of suspects, victims, and cases across Karnataka." },
    { property: "og:title", content: "Crime Network — KCIP" },
    { property: "og:description", content: "Graph visualization of suspects, victims, and cases across Karnataka." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ]}),
  component: NetworkPage,
});

function NetworkPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { data } = useGraph();
  const graphNodes = data?.nodes ?? [];
  const graphEdges = data?.edges ?? [];
  return (
    <>
      <PageHeader title="Crime Network" description="Graph of entities and their relationships" breadcrumbs={[{ label: "Home" }, { label: "Crime Network" }]} />
      <Card className="overflow-hidden p-0">
        <div className="h-[640px]">
          {mounted && (
            <ReactFlow nodes={graphNodes} edges={graphEdges} fitView>
              <Background />
              <MiniMap />
              <Controls />
            </ReactFlow>
          )}
        </div>
      </Card>
    </>
  );
}
