export default function SectionLink({ id }: { id: string }) {
  return (
    <a
      href={`#${encodeURIComponent(id)}`}
      className="nextra-focus subheading-anchor"
      aria-label="Permalink for this section"
    />
  );
}
