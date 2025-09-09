// src/components/Button.jsx
import React from "react";
import { Plus } from 'lucide-react';

function cn(...classes) {
  // Fungsi utilitas untuk menggabungkan nama-nama kelas
  return classes.filter(Boolean).join(" ");
}

const SIZE_MAP = {
  sm: "btn-glass--sm",
  md: "",
  lg: "btn-glass--lg",
  icon: "btn-glass--icon",
};

export default function Button({
  children,
  icon,
  reveal = false,
  size = "md",
  className = "",
  type = "button",
  ...props
}) {
  const sizeClass = SIZE_MAP[size] || "";
  const revealClass = reveal ? "btn-reveal" : "";
  const classes = cn("btn-glass", sizeClass, revealClass, className);

  // console.log untuk melacak render komponen dan properti
  console.log("Rendering Button with props:", { size, reveal, className, type });

  // aria-label akan diatur jika tidak ada atau jika children adalah string
  const ariaLabel = props["aria-label"] || (typeof children === "string" ? children : undefined);

  return (
    <button type={type} className={classes} aria-label={ariaLabel} {...props}>
      {/* Kondisi untuk tombol dengan efek reveal */}
      {reveal ? (
        <>
          {/* Menggunakan prop `icon` sebagai komponen React dan memastikan perataan tengah */}
          <span className="btn-reveal__icon text-lg leading-none flex items-center">{icon ?? <Plus size={20} />}</span>
          <span className="btn-reveal__label">{children}</span>
        </>
      ) : (
        <>
          {/* Kondisi untuk tombol standar, memastikan perataan tengah jika hanya ada ikon */}
          {icon && <span className="text-lg leading-none flex items-center">{icon}</span>}
          {children && <span className={icon ? "ml-2" : ""}>{children}</span>}
        </>
      )}
    </button>
  );
}
