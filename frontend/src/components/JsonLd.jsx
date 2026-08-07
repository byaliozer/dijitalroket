import { useEffect } from "react";

/**
 * Injects a JSON-LD <script type="application/ld+json"> into <head>.
 * Cleans up on unmount / when data changes. `id` must be unique per schema block.
 */
export default function JsonLd({ id, data }) {
  useEffect(() => {
    if (!data) return;
    const scriptId = `jsonld-${id}`;
    let el = document.getElementById(scriptId);
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = scriptId;
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
    return () => {
      const node = document.getElementById(scriptId);
      if (node) node.remove();
    };
  }, [id, data]);

  return null;
}
