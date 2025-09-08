import Link from "next/link";
import ImageUpload from "../ImageUpload";
import Container from "@/components/Container";

const Nav = () => {
  return (
    <nav className="flex items-center h-16 border border-zinc-200">
      <Container className="flex gap-6 items-center flex-row">
        <p className="w-40 flex-grow-0 mb-0">
          <Link href="/">
            <div>Hi</div>
          </Link>
        </p>
        <ul className="fixed right-5 top-2 justify-end gap-6 m-0">
          <ImageUpload />
        </ul>
      </Container>
    </nav>
  );
};

export default Nav;
