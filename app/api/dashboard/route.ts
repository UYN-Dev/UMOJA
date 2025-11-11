import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get internal user ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, role')
      .eq('clerk_id', clerkId)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (userData.role === 'guardian') {
      // Get guardian profile and children
      const { data: guardianProfile, error: guardianError } = await supabase
        .from('guardian_profiles')
        .select('*')
        .eq('user_id', userData.id)
        .single();

      // If guardian profile doesn't exist, that's okay - return empty data
      if (guardianError && guardianError.code === 'PGRST116') {
        // No guardian profile yet - return empty data
        return NextResponse.json({
          guardian: null,
          children: [],
          userRole: 'guardian'
        });
      }

      if (guardianError) {
        console.error('Error fetching guardian profile:', guardianError);
        return NextResponse.json({ 
          error: 'Failed to load guardian profile' 
        }, { status: 500 });
      }

      // Get children associated with this guardian
      let childrenData: any[] = [];
      
      if (guardianProfile?.id) {
        const { data: children, error: childrenError } = await supabase
          .from('child_guardian_relationships')
          .select(`
            id,
            relationship_type,
            is_primary_guardian,
            child_profile:child_profiles (
              id,
              first_name,
              last_name,
              date_of_birth,
              gender,
              grade,
              school_name,
              profile_completed,
              user:users (
                id,
                clerk_id
              )
            )
          `)
          .eq('guardian_profile_id', guardianProfile.id);
        
        if (childrenError) {
          console.error('Error fetching children:', childrenError);
          // Don't fail the whole request if children fetch fails
        } else {
          childrenData = children || [];
        }
      }

      return NextResponse.json({
        guardian: guardianProfile,
        children: childrenData,
        userRole: 'guardian'
      });
    } else if (userData.role === 'child') {
      // Get child profile
      const { data: childProfile, error: childError } = await supabase
        .from('child_profiles')
        .select('*')
        .eq('user_id', userData.id)
        .single();

      return NextResponse.json({
        child: childProfile,
        userRole: 'child'
      });
    }

    return NextResponse.json({ error: 'Invalid user role' }, { status: 400 });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
