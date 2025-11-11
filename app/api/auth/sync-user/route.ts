import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { userType } = await request.json();
    
    if (!userType || !['child', 'guardian'].includes(userType)) {
      return NextResponse.json({ error: 'Invalid user type' }, { status: 400 });
    }

    // Check if user already exists in database
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkId)
      .single();

    let userData;

    if (fetchError && fetchError.code === 'PGRST116') {
      // User doesn't exist, create new user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          clerk_id: clerkId,
          email: user.emailAddresses[0]?.emailAddress || '',
          role: userType
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating user:', createError);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
      }

      userData = newUser;
    } else if (existingUser) {
      // User exists: update role and email if needed
      const nextEmail = user.emailAddresses[0]?.emailAddress || '';
      const needsRoleUpdate = existingUser.role !== userType;
      const needsEmailUpdate = nextEmail && existingUser.email !== nextEmail;

      if (needsRoleUpdate || needsEmailUpdate) {
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({
            ...(needsRoleUpdate ? { role: userType } : {}),
            ...(needsEmailUpdate ? { email: nextEmail } : {})
          })
          .eq('clerk_id', clerkId)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating user:', updateError);
          return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
        }

        userData = updatedUser;
      } else {
        userData = existingUser;
      }
    } else {
      console.error('Error fetching user:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }

    // Note: Clerk user metadata will be updated client-side
    // Server-side user object doesn't have update method

    // Determine redirect URL
    const redirectUrl = userType === 'child' ? '/child-dashboard' : '/guardian-dashboard';

    return NextResponse.json({ 
      success: true, 
      user: userData, 
      redirectUrl 
    });

  } catch (error) {
    console.error('Sync user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 