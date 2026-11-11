import Nav from "@/components/ui/Nav";
import { PageFooter, PageMain } from "@/components/sections/PageParts";
import { Credits, MusicHeader, Sets } from "@/components/sections/MusicSections";

export default function MusicPage() {
  return (
    <>
      <Nav variant="page" />
      <PageMain>
        <MusicHeader />
        <Sets />
        <Credits />
        <PageFooter />
      </PageMain>
    </>
  );
}
