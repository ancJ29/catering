export function stopMouseEvent<T extends React.MouseEvent>(e: T) {
  e.preventDefault();
  e.stopPropagation();
}
