/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Timer from "./components/Timer";

export default function App() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <Timer initialMinutes={90} />
    </main>
  );
}

