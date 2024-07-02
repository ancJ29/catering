export const scroll = (
  id: string,
  options?: ScrollIntoViewOptions,
) => {
  const el = document.getElementById(id);
  el?.scrollIntoView(
    options || {
      block: "center",
      inline: "center",
      behavior: "smooth",
    },
  );
};
