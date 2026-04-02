import FooterSection from "../revamped/footerSection/footer";
import HeaderSection from "../revamped/headerSection/header";

interface PrivacyPolicyPageProps {
  searchParams?: Promise<{
    layout?: string | string[];
  }>;
}

async function PrivacyPolicyPage({ searchParams }: PrivacyPolicyPageProps) {
  const resolvedSearchParams = await searchParams;
  const rawLayout = resolvedSearchParams?.layout;
  const layoutParam = Array.isArray(rawLayout) ? rawLayout[0] : rawLayout;
  const showLayout = layoutParam?.toLowerCase() !== "false";

  return (
    <div className="flex flex-col">
      {showLayout && (
        <div className="bg-[linear-gradient(180deg,#000000_0%,#131D31_25%,#1D293D_50%,#131D31_75%,#000000_100%)]">
          <HeaderSection />
        </div>
      )}

      <div className="bg-[#F7F7F7] py-20 px-6">
        <div className="">
          <strong className="font-onest text-[28px] font-bold text-[#0D111A]">
            Privacy Policy
          </strong>

          <p className="font-onest text-[16px] mt-6 text-[#0D111A]">
            This privacy policy applies to the Statoz app (hereby referred to as
            &quot;Application&quot;) for mobile devices that was created by
            (hereby referred to as &quot;Service Provider&quot;) as a Free
            service. This service is intended for use &quot;AS IS&quot;.
          </p>

          <strong className="font-onest text-[22px] font-bold mt-8 block text-[#0D111A]">
            Information Collection and Use
          </strong>
          <p className="font-onest text-[16px] mt-4 text-[#0D111A]">
            The Application collects information when you download and use it.
            This information may include information such as:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2 font-onest text-[16px] text-[#0D111A]">
            <li>
              Your device&apos;s Internet Protocol address (e.g. IP address)
            </li>
            <li>
              The pages of the Application that you visit, the time and date of
              your visit, the time spent on those pages
            </li>
            <li>The time spent on the Application</li>
            <li>The operating system you use on your mobile device</li>
          </ul>

          <p className="font-onest text-[16px] mt-6 text-[#0D111A]">
            The Application does not gather precise information about the
            location of your mobile device.
          </p>

          <p className="font-onest text-[16px] mt-6 text-[#0D111A]">
            The Service Provider may use the information you provided to contact
            you from time to time to provide you with important information,
            required notices and marketing promotions.
          </p>

          <p className="font-onest text-[16px] mt-6 text-[#0D111A]">
            For a better experience, while using the Application, the Service
            Provider may require you to provide us with certain personally
            identifiable information. The information that the Service Provider
            requests will be retained by them and used as described in this
            privacy policy.
          </p>

          <strong className="font-onest text-[22px] font-bold mt-8 block text-[#0D111A]">
            Third Party Access
          </strong>
          <p className="font-onest text-[16px] mt-4 text-[#0D111A]">
            Only aggregated, anonymized data is periodically transmitted to
            external services to aid the Service Provider in improving the
            Application and their service. The Service Provider may share your
            information with third parties in the ways that are described in
            this privacy statement.
          </p>
          <p className="font-onest text-[16px] mt-4 text-[#0D111A]">
            The Service Provider may disclose User Provided and Automatically
            Collected Information:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2 font-onest text-[16px] text-[#0D111A]">
            <li>
              as required by law, such as to comply with a subpoena, or similar
              legal process;
            </li>
            <li>
              when they believe in good faith that disclosure is necessary to
              protect their rights, protect your safety or the safety of others,
              investigate fraud, or respond to a government request;
            </li>
            <li>
              with their trusted services providers who work on their behalf, do
              not have an independent use of the information we disclose to
              them, and have agreed to adhere to the rules set forth in this
              privacy statement.
            </li>
          </ul>

          <strong className="font-onest text-[22px] font-bold mt-8 block text-[#0D111A]">
            Opt-Out Rights
          </strong>
          <p className="font-onest text-[16px] mt-4 text-[#0D111A]">
            You can stop all collection of information by the Application easily
            by uninstalling it. You may use the standard uninstall processes as
            may be available as part of your mobile device or via the mobile
            application marketplace or network.
          </p>

          <strong className="font-onest text-[22px] font-bold mt-8 block text-[#0D111A]">
            Data Retention Policy
          </strong>
          <p className="font-onest text-[16px] mt-4 text-[#0D111A]">
            The Service Provider will retain User Provided data for as long as
            you use the Application and for a reasonable time thereafter. If
            you&apos;d like them to delete User Provided Data that you have
            provided via the Application, please contact them at{" "}
            <a
              href="mailto:kshitizdr842@gmail.com"
              className="underline underline-offset-2"
            >
              support@statoz.in
            </a>{" "}
            and they will respond in a reasonable time.
          </p>

          <strong className="font-onest text-[22px] font-bold mt-8 block text-[#0D111A]">
            Children
          </strong>
          <p className="font-onest text-[16px] mt-4 text-[#0D111A]">
            The Service Provider does not use the Application to knowingly
            solicit data from or market to children under the age of 13.
          </p>
          <p className="font-onest text-[16px] mt-4 text-[#0D111A]">
            The Service Provider does not knowingly collect personally
            identifiable information from children. The Service Provider
            encourages all children to never submit any personally identifiable
            information through the Application and/or Services. The Service
            Provider encourages parents and legal guardians to monitor their
            children&apos;s Internet usage and to help enforce this Policy by
            instructing their children never to provide personally identifiable
            information through the Application and/or Services without their
            permission. If you have reason to believe that a child has provided
            personally identifiable information to the Service Provider through
            the Application and/or Services, please contact the Service Provider
            (
            <a
              href="mailto:kshitizdr842@gmail.com"
              className="underline underline-offset-2"
            >
              support@statoz.in
            </a>
            ) so that they will be able to take the necessary actions. You must
            also be at least 16 years of age to consent to the processing of
            your personally identifiable information in your country (in some
            countries we may allow your parent or guardian to do so on your
            behalf).
          </p>

          <strong className="font-onest text-[22px] font-bold mt-8 block text-[#0D111A]">
            Security
          </strong>
          <p className="font-onest text-[16px] mt-4 text-[#0D111A]">
            The Service Provider is concerned about safeguarding the
            confidentiality of your information. The Service Provider provides
            physical, electronic, and procedural safeguards to protect
            information the Service Provider processes and maintains.
          </p>

          <strong className="font-onest text-[22px] font-bold mt-8 block text-[#0D111A]">
            Changes
          </strong>
          <p className="font-onest text-[16px] mt-4 text-[#0D111A]">
            This Privacy Policy may be updated from time to time for any reason.
            The Service Provider will notify you of any changes to the Privacy
            Policy by updating this page with the new Privacy Policy. You are
            advised to consult this Privacy Policy regularly for any changes, as
            continued use is deemed approval of all changes.
          </p>

          <p className="font-onest text-[16px] mt-6 text-[#0D111A]">
            This privacy policy is effective as of 2026-01-29
          </p>

          <strong className="font-onest text-[22px] font-bold mt-8 block text-[#0D111A]">
            Your Consent
          </strong>
          <p className="font-onest text-[16px] mt-4 text-[#0D111A]">
            By using the Application, you are consenting to the processing of
            your information as set forth in this Privacy Policy now and as
            amended by us.
          </p>

          <strong className="font-onest text-[22px] font-bold mt-8 block text-[#0D111A]">
            Contact Us
          </strong>
          <p className="font-onest text-[16px] mt-4 text-[#0D111A]">
            If you have any questions regarding privacy while using the
            Application, or have questions about the practices, please contact
            the Service Provider via email at{" "}
            <a
              href="mailto:kshitizdr842@gmail.com"
              className="underline underline-offset-2"
            >
              support@statoz.in
            </a>
            .
          </p>

          <hr className="my-8 border-[#D6DBE2]" />
        </div>
      </div>

      {showLayout && <FooterSection />}
    </div>
  );
}

export default PrivacyPolicyPage;
