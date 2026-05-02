import { BookOpen, Heart, Globe, Users } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about the Okunpedia project and its mission.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <BookOpen className="h-16 w-16 text-primary-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-wiki-text">About Okunpedia</h1>
        <p className="text-lg text-wiki-muted mt-3 max-w-2xl mx-auto">
          Preserving and celebrating the rich heritage of Okun people through
          community-driven documentation.
        </p>
      </div>

      <div className="wiki-content bg-white rounded-lg border border-wiki-border p-8">
        <h2>Our Mission</h2>
        <p>
          Okunpedia is a community-driven encyclopedia dedicated to documenting the
          history, culture, geography, and heritage of Okun-speaking towns and
          communities in Kogi State, Nigeria. The Okun people, a subgroup of the
          Yoruba, have a rich cultural heritage that deserves to be preserved and
          shared with the world.
        </p>

        <h2>What is Okun?</h2>
        <p>
          Okun refers to the Yoruba-speaking people of Kogi State, primarily found
          in five Local Government Areas: Kabba/Bunu, Ijumu, Mopa-Muro, Yagba East,
          and Yagba West. The name &ldquo;Okun&rdquo; is derived from the traditional greeting
          among these people, and it represents a shared cultural identity that binds
          these communities together.
        </p>

        <h2>Why This Matters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8 not-prose">
          <div className="text-center p-6 bg-primary-50 rounded-lg">
            <Heart className="h-8 w-8 text-primary-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Preservation</h3>
            <p className="text-sm text-wiki-muted">
              Documenting traditions, stories, and knowledge before they fade.
            </p>
          </div>
          <div className="text-center p-6 bg-primary-50 rounded-lg">
            <Globe className="h-8 w-8 text-primary-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Visibility</h3>
            <p className="text-sm text-wiki-muted">
              Making Okun culture accessible to the world.
            </p>
          </div>
          <div className="text-center p-6 bg-primary-50 rounded-lg">
            <Users className="h-8 w-8 text-primary-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Community</h3>
            <p className="text-sm text-wiki-muted">
              Connecting Okun people across the globe.
            </p>
          </div>
        </div>

        <h2>How to Contribute</h2>
        <p>
          Okunpedia is built by the community, for the community. If you have
          knowledge about any Okun town — its history, festivals, prominent figures,
          or cultural practices — we welcome your contributions. Simply create an
          account and start adding or editing content.
        </p>
        <p>
          Every piece of information matters, whether it&apos;s a detailed historical
          account or a small anecdote about a local tradition. Together, we can build
          the most comprehensive resource about Okun land.
        </p>
      </div>
    </div>
  );
}
