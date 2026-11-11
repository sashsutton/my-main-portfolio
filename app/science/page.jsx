import Nav from "@/components/ui/Nav";
import { PageFooter, PageMain } from "@/components/sections/PageParts";
import { Education, Projects, Research, ScienceHeader } from "@/components/sections/ScienceSections";

export default function SciencePage() {
  return (
    <>
      <Nav variant="page" />
      <PageMain>
        <ScienceHeader />
        <Research />
        <Projects />
        <Education />
        <PageFooter />
      </PageMain>
    </>
  );
}
