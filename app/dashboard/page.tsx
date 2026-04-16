import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { InteractiveBackground } from '@/components/photobooth/InteractiveBackground';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut, ArrowLeft, ExternalLink } from 'lucide-react';
import Image from 'next/image';

const prisma = new PrismaClient();

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <InteractiveBackground />
            <div className="z-10 bg-black/60 border border-white/10 p-12 rounded-3xl text-center backdrop-blur-xl">
                 <h1 className="text-3xl font-bold text-white mb-4">Unauthorized</h1>
                 <p className="text-zinc-400 mb-8">You need to sign in to view your dashboard.</p>
                 <Link href="/api/auth/signin">
                    <Button>Sign In</Button>
                 </Link>
            </div>
        </main>
    );
  }

  // Fetch photos for the logged in user
  const photos = await prisma.photo.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="relative min-h-screen p-8 pt-20">
      <InteractiveBackground />
      
      <div className="relative z-10 max-w-5xl mx-auto">
         <div className="flex flex-col md:flex-row items-center justify-between bg-black/50 backdrop-blur-xl p-6 rounded-3xl border border-white/10 mb-8">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
               {session.user.image && <Image src={session.user.image} alt="User" width={50} height={50} className="rounded-full border border-white/20"/>}
               <div>
                  <h1 className="text-2xl font-bold text-white">Hello, {session.user.name}</h1>
                  <p className="text-zinc-400 text-sm">Role: {session.user.role}</p>
               </div>
            </div>

            <div className="flex gap-4">
               <Link href="/">
                   <Button variant="outline" className="border-white/20 hover:bg-white/10">
                       <ArrowLeft className="w-4 h-4 mr-2" /> Home
                   </Button>
               </Link>
               <Link href="/api/auth/signout">
                   <Button variant="destructive" className="bg-red-500/20 text-red-400 hover:bg-red-500/40 border border-red-500/50">
                       <LogOut className="w-4 h-4 mr-2" /> Sign Out
                   </Button>
               </Link>
            </div>
         </div>

         <div className="bg-black/60 backdrop-blur-xl p-8 rounded-3xl border border-white/10 min-h-[50vh]">
            <h2 className="text-2xl font-semibold text-white mb-6">Your Photobooth Collection</h2>
            
            {photos.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-zinc-500 mb-4">You haven't saved any photos yet.</p>
                    <Link href="/booth">
                        <Button className="bg-pink-600 hover:bg-pink-700">Take a Photo Now</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {photos.map(photo => (
                        <div key={photo.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center hover:bg-white/10 transition-colors">
                           <div className="w-full h-48 bg-zinc-900 rounded-xl flex items-center justify-center mb-4">
                               {/* We only have drive file IDs. Drive images don't render directly via URL unless public. Ideally proxy through an API, but for now we just link out. */}
                               <span className="text-zinc-600 text-sm">Image Stored in Drive</span>
                           </div>
                           <p className="text-xs text-zinc-400 mb-4">{new Date(photo.createdAt).toLocaleString()}</p>
                           {photo.driveUrl && (
                               <a href={photo.driveUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                                    <Button variant="secondary" className="w-full gap-2">
                                        View in Drive <ExternalLink className="w-4 h-4" />
                                    </Button>
                               </a>
                           )}
                        </div>
                    ))}
                </div>
            )}
         </div>
      </div>
    </main>
  );
}
