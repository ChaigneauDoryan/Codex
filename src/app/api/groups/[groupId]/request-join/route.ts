
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import GroupJoinRequestEmail from '@/emails/GroupJoinRequestEmail';
import { render } from '@react-email/render';
import { RoleInGroup } from '@prisma/client';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request, { params }: { params: { groupId: string } }) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const { groupId } = await params;

  if (!groupId) {
    return NextResponse.json({ message: 'Group ID is required.' }, { status: 400 });
  }

  try {
    // 1. Check if the group exists
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          where: { role: RoleInGroup.ADMIN },
          include: { user: true },
        },
      },
    });

    if (!group) {
      return NextResponse.json({ message: 'Group not found.' }, { status: 404 });
    }

    // 2. Check if user is already a member
    const existingMembership = await prisma.groupMember.findUnique({
      where: { group_id_user_id: { group_id: groupId, user_id: userId } },
    });

    if (existingMembership) {
      return NextResponse.json({ message: 'You are already a member of this group.' }, { status: 400 });
    }

    // 3. Check if user has already a pending request
    const existingRequest = await prisma.groupJoinRequest.findUnique({
      where: { groupId_userId: { groupId, userId } },
    });

    if (existingRequest && existingRequest.status === 'PENDING') {
      return NextResponse.json({ message: 'You have already requested to join this group.' }, { status: 400 });
    }

    // 4. Create the join request (or update if it was declined before)
    await prisma.groupJoinRequest.upsert({
      where: { groupId_userId: { groupId, userId } },
      update: { status: 'PENDING' },
      create: { 
        groupId: groupId,
        userId: userId,
        status: 'PENDING',
      },
    });

    // 5. Send email notification to admins
    const admins = group.members;
    const requester = session.user;

    for (const admin of admins) {
      if (admin.user.email) {
        try {
          const emailHtml = await render(GroupJoinRequestEmail({
            adminName: admin.user.name || 'Admin',
            requesterName: requester.name || 'Un utilisateur',
            groupName: group.name,
            managementUrl: `${process.env.NEXTAUTH_URL}/groups/${groupId}/edit`,
            status: 'pending',
          }));

          await resend.emails.send({
            from: `Shelfy <${process.env.RESEND_FROM_EMAIL}>` || 'noreply@shelfy.fr',
            to: admin.user.email,
            subject: `Nouvelle demande pour rejoindre ${group.name}`,
            html: emailHtml,
          });
        } catch (emailError) {
          console.error(`Failed to send email to ${admin.user.email}:`, emailError);
          // Continue even if one email fails
        }
      }
    }

    return NextResponse.json({ message: 'Join request sent successfully.' }, { status: 201 });

  } catch (error) {
    console.error('Error processing join request:', error);
    return NextResponse.json({ message: 'An internal error occurred.' }, { status: 500 });
  }
}
