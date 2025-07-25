export default function Footer() {
  return (
    <footer className="bg-green-700 text-white text-center h-12 flex items-center justify-center">
      © {new Date().getFullYear()} AgriAssist. All rights reserved.
    </footer>
  );
}
